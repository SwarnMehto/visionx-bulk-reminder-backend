import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";

import {
  launchCampaign,
} from "../controllers/bulkController.js";

const router = express.Router();

router.post(
  "/launch",
  authMiddleware,
  launchCampaign
);

export default router;