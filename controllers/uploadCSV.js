import fs from "fs";
import csv from "csv-parser";
import Contact from "../models/Contact.js";

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
        results.push({ ...row, campaignId });
      })
      .on("end", async () => {
        await Contact.insertMany(results);

        fs.unlinkSync(filePath);

        return res.json({
          success: true,
          total: results.length,
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