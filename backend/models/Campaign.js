import mongoose from "mongoose";

const CampaignSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    template: { type: String, required: true },
    audience: { type: String, required: true },
    schedule: { type: String, default: null },

    // Advanced features
    status: {
      type: String,
      enum: ["scheduled", "sending", "sent", "completed", "failed"],
      default: "scheduled",
    },

    progress: { type: Number, default: 0 },

    stats: {
      sent: { type: Number, default: 0 },
      delivered: { type: Number, default: 0 },
      read: { type: Number, default: 0 },
      clicked: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

export default mongoose.model("Campaign", CampaignSchema);
