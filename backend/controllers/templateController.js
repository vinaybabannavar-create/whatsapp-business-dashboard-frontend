import { Template } from "../models/Template.js";

export const getTemplates = async (req, res) => {
  try {
    const templates = await Template.find().sort({ createdAt: -1 });
    res.json(templates);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to load templates" });
  }
};

export const createTemplate = async (req, res) => {
  try {
    const template = await Template.create(req.body);
    res.status(201).json(template);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create template" });
  }
};
