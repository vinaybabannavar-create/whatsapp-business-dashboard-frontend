import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    phone_number: { type: String, required: true, index: true },
    text: { type: String, default: "" },

    fileUrl: { type: String, default: null },
    fileName: { type: String, default: null },
    fileType: {
      type: String,
      enum: ["image", "audio", "document", null],
      default: null,
    },

    from: { type: String, enum: ["user", "business"], required: true },
    status: { type: String, default: "sent" },
  },
  { timestamps: true }
);

export default mongoose.model("Message", messageSchema);
