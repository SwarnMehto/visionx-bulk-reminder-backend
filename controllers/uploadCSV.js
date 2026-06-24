import fs from "fs";
import csv from "csv-parser";
import Contact from "../models/Contact.js";
import Campaign from "../models/Campaign.js";

export const uploadCSV = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    const filePath = req.file.path;
    const campaignId = req.body.campaignId;

    if (!campaignId) {
      return res.status(400).json({
        success: false,
        message: "Campaign ID missing",
      });
    }

    // check file exists
    if (!fs.existsSync(filePath)) {
      return res.status(400).json({
        success: false,
        message: "Uploaded file not found on server",
      });
    }

    const results = [];

    const stream = fs.createReadStream(filePath)
      .pipe(csv());

    stream.on("data", (row) => {
      results.push({
        ...row,
        campaignId,
      });
    });

    stream.on("end", async () => {
      try {
        if (results.length === 0) {
          return res.status(400).json({
            success: false,
            message: "CSV is empty",
          });
        }

        await Contact.insertMany(results);

        await Campaign.findByIdAndUpdate(campaignId, {
          totalContacts: results.length,
        });

        fs.unlinkSync(filePath);

        return res.json({
          success: true,
          total: results.length,
        });

      } catch (err) {
        console.log("CSV SAVE ERROR:", err);

        return res.status(500).json({
          success: false,
          message: "CSV Processing Failed",
        });
      }
    });

    stream.on("error", (err) => {
      console.log("CSV STREAM ERROR:", err);

      return res.status(500).json({
        success: false,
        message: "CSV Read Error",
      });
    });

  } catch (error) {
    console.log("UPLOAD ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};