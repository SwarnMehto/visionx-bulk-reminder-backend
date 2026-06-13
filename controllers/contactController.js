import fs from "fs";

import csv from "csv-parser";

import Contact from "../models/Contact.js";

// ======================================
// CSV UPLOAD
// ======================================

export const uploadCSV =
  async (req, res) => {
    try {
      const results = [];

      const campaignId =
        req.body.campaignId;

      fs.createReadStream(
        req.file.path
      )

        .pipe(csv())

        .on("data", (data) => {
          results.push({
            name:
              data.name || "",

            phone:
              data.phone || "",

            email:
              data.email || "",

            campaignId,
          });
        })

        .on(
          "end",
          async () => {
            await Contact.insertMany(
              results
            );

            // DELETE FILE
            fs.unlinkSync(
              req.file.path
            );

            res.json({
              success: true,

              total:
                results.length,

              message:
                "Contacts Uploaded Successfully 🚀",
            });
          }
        );

    } catch (error) {
      console.log(error);

      res.status(500).json({
        message:
          error.message,
      });
    }
  };

// ======================================
// GET CONTACTS
// ======================================

export const getContacts =
  async (req, res) => {
    try {
      const contacts =
        await Contact.find({
          campaignId:
            req.params.id,
        });

      res.json({
        success: true,

        contacts,
      });

    } catch (error) {
      res.status(500).json({
        message:
          error.message,
      });
    }
  };