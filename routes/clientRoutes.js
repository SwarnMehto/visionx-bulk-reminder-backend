import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import Client from "../models/Client.js";

const router = express.Router();

router.get(
  "/",
  authMiddleware,
  async (req, res) => {
    const clients =
      await Client.find({
        userId: req.user.id,
      });

    res.json({
      success: true,
      clients,
      totalClients:
        clients.length,
    });
  }
);

export default router;