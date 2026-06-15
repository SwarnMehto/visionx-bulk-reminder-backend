import fs from "fs";
import csv from "csv-parser";
import Contact from "../models/Contact.js";

export const uploadCSV = async (req, res) => {
  try {
    const filePath = req.file.path;
    const campaignId = req.body.campaignId;

    if (!filePath || !campaignId) {
      return res.status(400).json({
        success: false,
        message: "File or Campaign ID missing",
      });
    }

    const results = [];

    // CSV read
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
          if (results.length === 0) {
            return res.json({
              success: false,
              message: "CSV is empty",
            });
          }

          // 🚀 BULK INSERT (FAST)
          await Contact.insertMany(results);

          // optional: delete file after upload
          fs.unlinkSync(filePath);

          return res.json({
            success: true,
            total: results.length,
            message: "Contacts uploaded successfully",
          });
        } catch (err) {
          console.log(err);

          return res.status(500).json({
            success: false,
            message: "Database insert failed",
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