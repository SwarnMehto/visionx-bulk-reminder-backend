import express from "express";

import multer from "multer";

import {
  uploadCSV,
  getContacts,
} from "../controllers/contactController.js";

const router =
  express.Router();

// =======================
// MULTER STORAGE
// =======================

const storage =
  multer.diskStorage({
    destination: (
      req,
      file,
      cb
    ) => {
      cb(
        null,
        "uploads/"
      );
    },

    filename: (
      req,
      file,
      cb
    ) => {
      cb(
        null,
        Date.now() +
          "-" +
          file.originalname
      );
    },
  });

const upload =
  multer({
    storage,
  });

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

router.get(
  "/:id",
  getContacts
);

export default router;