// backend/controllers/campaignController.js
import Campaign from "../models/Campaign.js";
import { emitDashboardStats } from "./analyticsController.js";

export const createCampaign = async (req, res) => {
  try {
    const campaign = await Campaign.create(req.body);

    await emitDashboardStats(req.app); // 🔥 realtime update

    res.json(campaign);
  } catch (err) {
    console.error("Campaign create error:", err);
    res.status(500).json({ message: "Failed to create campaign" });
  }
};

export const deleteCampaign = async (req, res) => {
  try {
    await Campaign.findByIdAndDelete(req.params.id);

    await emitDashboardStats(req.app);

    res.json({ success: true });
  } catch (err) {
    console.error("Delete campaign error:", err);
    res.status(500).json({ message: "Failed to delete campaign" });
  }
};
