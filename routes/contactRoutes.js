import express from "express";
import multer from "multer";
import path from "path";
import redis from "../config/redis.js";
import {
  uploadCSV,
  getContacts,
} from "../controllers/contactController.js";

const router = express.Router();

// =======================
// MULTER STORAGE
// =======================

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(
      null,
      path.join(process.cwd(), "uploads")
    );
  },

  filename: (req, file, cb) => {
    cb(
      null,
      Date.now() +
        "-" +
        file.originalname
    );
  },
});

const upload = multer({ storage });

// =======================
// UPLOAD CSV
// =======================

router.post(
  "/upload",
  upload.single("file"),
  uploadCSV
);

// =======================
// GET CONTACTS
// =======================

router.get("/:id", getContacts);

// =======================
// PROGRESS ROUTE
// =======================

router.get("/progress/:jobId", async (req, res) => {
  try {
    const progress = await redis.get(
      `csv-progress-${req.params.jobId}`
    );

    res.json({
      success: true,
      progress: progress || 0,
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Error fetching progress",
    });
  }
});

export default router;