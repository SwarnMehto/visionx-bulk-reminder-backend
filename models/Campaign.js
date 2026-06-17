import mongoose from "mongoose";

const campaignSchema = new mongoose.Schema(
  {
    name: String,

    partyName: String,

    type: String,

    message: String,

    poster: String,

    status: {
      type: String,
      default: "Draft",
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    totalContacts: {
      type: Number,
      default: 0,
    },
    sentCount: {
      type: Number,
      default: 0,
    },
    failedCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model(
  "Campaign",
  campaignSchema
);