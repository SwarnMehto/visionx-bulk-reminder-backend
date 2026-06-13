import mongoose from "mongoose";

const contactSchema =
  new mongoose.Schema(
    {
      name: String,

      phone: String,

      email: String,

      campaignId: {
        type:
          mongoose.Schema.Types.ObjectId,

        ref: "Campaign",
      },
    },

    {
      timestamps: true,
    }
  );

export default mongoose.model(
  "Contact",
  contactSchema
);