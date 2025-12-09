import mongoose from "mongoose";

const contactSchema = new mongoose.Schema({
  name: String,
  phone: String,
  labels: [String],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Contact = mongoose.model("Contact", contactSchema);

export default Contact;   // <-- THIS WAS MISSING
