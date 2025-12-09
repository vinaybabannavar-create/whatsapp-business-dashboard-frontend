import mongoose from "mongoose";

const TemplateSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: { type: String, required: true },
    content: { type: String, required: true },
    variables: [{ type: String }],
    version: { type: Number, default: 1 }
  },
  { timestamps: true }
);

export default mongoose.model("Template", TemplateSchema);
