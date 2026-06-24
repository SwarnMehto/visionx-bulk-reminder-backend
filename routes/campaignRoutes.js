import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";

import {
  createCampaign,
  getCampaigns,
  getSingleCampaign,
  launchCampaign,
  updateCampaign
} from "../controllers/campaignController.js";

const router = express.Router();

// CREATE
router.post("/create", authMiddleware, createCampaign);

// GET ALL
router.get("/", authMiddleware, getCampaigns);

// GET SINGLE
router.get("/:id", authMiddleware, getSingleCampaign);

// UPDATE
router.put("/:id", authMiddleware, updateCampaign);

// LAUNCH
router.put("/:id/launch", authMiddleware, launchCampaign);

export default router;