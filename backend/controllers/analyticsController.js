// backend/controllers/analyticsController.js
import Contact from "../models/Contact.js";
import Message from "../models/Message.js";
import Campaign from "../models/Campaign.js";

/**
 * Build dashboard stats (used by API and emitter)
 */
export async function generateDashboardStats(range = "Today") {
  try {
    const contacts = await Contact.countDocuments();
    const campaigns = await Campaign.countDocuments();

    // messages today
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const messagesToday = await Message.countDocuments({
      createdAt: { $gte: today },
    });

    // active chats = number of unique phone_numbers that have messages
    const activeChats = await Message.distinct("phone_number").then(
      (list) => list.length
    );

    // Very small example weekly data (replace with real aggregation later)
    const weeklyMessages = [
      { label: "Mon", messages: 120 },
      { label: "Tue", messages: 150 },
      { label: "Wed", messages: 200 },
      { label: "Thu", messages: 180 },
      { label: "Fri", messages: 160 },
      { label: "Sat", messages: 90 },
      { label: "Sun", messages: 60 },
    ];

    return {
      totalContacts: contacts,
      activeChats,
      campaigns,
      messagesToday,
      weeklyMessages,
    };
  } catch (err) {
    console.error("generateDashboardStats error:", err);
    throw err;
  }
}

/**
 * Emit stats to connected clients via socket.io
 */
export async function emitDashboardStats(app, range = "Today") {
  try {
    const io = app.get("io");
    if (!io) {
      console.warn("emitDashboardStats: io not attached to app");
      return;
    }
    const stats = await generateDashboardStats(range);
    io.emit("dashboardStats", stats);
    console.log("Dashboard stats emitted:", stats);
  } catch (err) {
    console.error("emitDashboardStats error:", err);
  }
}

/**
 * Express handler for GET /api/analytics/dashboard
 */
export async function getDashboardStats(req, res) {
  try {
    const range = req.query.range || "Today";
    const stats = await generateDashboardStats(range);
    res.json(stats);
  } catch (err) {
    console.error("getDashboardStats error:", err);
    res.status(500).json({ message: "Failed to load dashboard stats" });
  }
}
