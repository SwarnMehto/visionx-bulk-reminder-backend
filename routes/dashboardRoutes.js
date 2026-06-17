import express from "express";

import authMiddleware from "../middleware/authMiddleware.js";

import Campaign from "../models/Campaign.js";

import Client from "../models/Client.js";

const router = express.Router();

router.get(
  "/stats",
  authMiddleware,
  async (req, res) => {
    try {
      const campaigns =
        await Campaign.find({
          userId:
            req.user.id,
        });

      const clients =
        await Client.find({
          userId:
            req.user.id,
        });

      const totalContacts =
        campaigns.reduce(
          (sum, c) =>
            sum +
            (c.totalContacts ||
              0),
          0
        );

      const totalSent =
        campaigns.reduce(
          (sum, c) =>
            sum +
            (c.sentCount || 0),
          0
        );

      res.json({
        success: true,

        totalCampaigns:
          campaigns.length,

        totalClients:
          clients.length,

        totalContacts,

        totalSent,
      });

    } catch (error) {
      res.status(500).json({
        message:
          error.message,
      });
    }
  }
);

export default router;