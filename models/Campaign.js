import mongoose from "mongoose";

const campaignSchema =
  new mongoose.Schema(
    {
      name: String,

      type: String,

      status: {
        type: String,

        default: "Draft",
      },

      userId: {
        type:
          mongoose.Schema.Types.ObjectId,

        ref: "User",
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