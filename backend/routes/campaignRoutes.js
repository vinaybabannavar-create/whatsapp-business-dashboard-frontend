import { Router } from "express";
import Campaign from "../models/Campaign.js";

const router = Router();

// GET all campaigns
router.get("/", async (req, res) => {
  const campaigns = await Campaign.find().sort({ createdAt: -1 });
  res.json(campaigns);
});

// CREATE
router.post("/", async (req, res) => {
  try {
    const campaign = await Campaign.create(req.body);

    req.app.get("io").emit("campaign_update", "created");

    res.json(campaign);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// UPDATE
router.put("/:id", async (req, res) => {
  try {
    const updated = await Campaign.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    req.app.get("io").emit("campaign_update", "updated");

    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE
router.delete("/:id", async (req, res) => {
  try {
    await Campaign.findByIdAndDelete(req.params.id);

    req.app.get("io").emit("campaign_update", "deleted");

    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
