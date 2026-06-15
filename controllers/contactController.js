import fs from "fs";
import csv from "csv-parser";
import Contact from "../models/Contact.js";
import { csvQueue } from "../queues/csvQueue.js";

// ======================================
// UPLOAD CSV (QUEUE SYSTEM ONLY)
// ======================================

export const uploadCSV = async (req, res) => {
  try {
    console.log("UPLOAD HIT");

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    if (!req.body.campaignId) {
      return res.status(400).json({
        success: false,
        message: "Campaign ID missing",
      });
    }

    const job = await csvQueue.add("process-csv", {
      filePath: req.file.path,
      campaignId: req.body.campaignId,
    });

    return res.json({
      success: true,
      jobId: job.id,
      message: "File uploaded, processing started",
    });

  } catch (error) {
    console.log("UPLOAD ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Upload failed",
    });
  }
};

// ======================================
// GET CONTACTS (MUST EXIST)
// ======================================

export const getContacts = async (req, res) => {
  try {
    const { id } = req.params;

    const contacts = await Contact.find({ campaignId: id });

    return res.json({
      success: true,
      contacts,
    });

  } catch (error) {
    console.log("GET CONTACTS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch contacts",
    });
  }
};