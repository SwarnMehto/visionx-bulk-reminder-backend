import express from "express";

import {
  sendEmail,
} from "../controllers/emailController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post(
  "/send",
  authMiddleware,
  sendEmail
);

export default router;