// backend/controllers/contactController.js
import Contact from "../models/Contact.js";
import { emitDashboardStats } from "./analyticsController.js";

/* GET all contacts */
export const getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });

    res.json(
      contacts.map((c) => ({
        ...c._doc,
        id: c._id.toString(),
      }))
    );
  } catch (err) {
    console.error("Get contacts error:", err);
    res.status(500).json({ message: "Failed to load contacts" });
  }
};

/* CREATE contact */
export const createContact = async (req, res) => {
  try {
    const contact = await Contact.create(req.body);

    // Emit updated dashboard stats
    await emitDashboardStats(req.app);

    res.json({
      ...contact._doc,
      id: contact._id.toString(),
    });
  } catch (err) {
    console.error("Create contact error:", err);
    res.status(500).json({ message: "Failed to create contact" });
  }
};

/* DELETE contact by id (optional) */
export const deleteContact = async (req, res) => {
  try {
    const { id } = req.params;
    await Contact.findByIdAndDelete(id);

    // Update dashboard numbers after deletion
    await emitDashboardStats(req.app);

    res.json({ success: true });
  } catch (err) {
    console.error("Delete contact error:", err);
    res.status(500).json({ message: "Failed to delete contact" });
  }
};
