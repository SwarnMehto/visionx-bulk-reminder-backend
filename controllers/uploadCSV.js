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

    const results = [];

    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (row) => {
        results.push({
          ...row,
          campaignId,
        });
      })
      .on("end", async () => {
        try {
          // Save Contacts
          await Contact.insertMany(results);

          // Update Campaign Contact Count
          await Campaign.findByIdAndUpdate(
            campaignId,
            {
              totalContacts: results.length,
            }
          );

          // Delete uploaded file
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

  } catch (error) {
    console.log("UPLOAD ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};