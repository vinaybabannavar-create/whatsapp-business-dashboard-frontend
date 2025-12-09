import express from "express";
import Template from "../models/Template.js";

const router = express.Router();

// GET all templates
router.get("/", async (req, res) => {
  const templates = await Template.find().sort({ createdAt: -1 });
  res.json(templates);
});

// CREATE template
router.post("/", async (req, res) => {
  try {
    const template = await Template.create(req.body);
    res.json(template);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ⭐ UPDATE template (IMPORTANT)
router.put("/:id", async (req, res) => {
  try {
    const updated = await Template.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE template
router.delete("/:id", async (req, res) => {
  await Template.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

export default router;
