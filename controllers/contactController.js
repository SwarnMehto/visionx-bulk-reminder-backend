import fs from "fs";
import Contact from "../models/Contact.js";
import { csvQueue } from "../queues/csvQueue.js";

// ======================================
// UPLOAD CSV
// ======================================

export const uploadCSV = async (req, res) => {
  try {
    console.log("REQ FILE =", req.file);

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

    console.log(
      "FILE EXISTS =",
      fs.existsSync(req.file.path)
    );

    const job = await csvQueue.add(
      "process-csv",
      {
        filePath: req.file.path,
        campaignId: req.body.campaignId,
      }
    );

    return res.json({
      success: true,
      jobId: job.id,
      message: "CSV queued successfully",
    });

  } catch (error) {
    console.log(
      "UPLOAD ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Upload Failed",
    });
  }
};

// ======================================
// GET CONTACTS
// ======================================

export const getContacts = async (req, res) => {
  try {
    const contacts =
      await Contact.find({
        campaignId: req.params.id,
      });

    return res.json({
      success: true,
      contacts,
    });

  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch contacts",
    });
  }
};