import fs from "fs";
import csv from "csv-parser";

import { Worker } from "bullmq";
import redis from "../config/redis.js";

import Contact from "../models/Contact.js";
import Campaign from "../models/Campaign.js";

const worker = new Worker(
  "csv-upload",

  async (job) => {
    try {
      const {
        filePath,
        campaignId,
      } = job.data;

      const results = [];

      await new Promise((resolve, reject) => {
  console.log("WORKER PATH =", filePath);
  console.log(
    "WORKER FILE EXISTS =",
    fs.existsSync(filePath)
  );

  if (!fs.existsSync(filePath)) {
    console.log("File not found:", filePath);
    return resolve();
  }
  
  if (!fs.existsSync(filePath)) {
  console.log("❌ File missing:", filePath);
  return;
}

  fs.createReadStream(filePath)
    .pipe(csv())

    .on("data", (row) => {
      results.push({
        name: row.name || "",
        phone: row.phone || "",
        email: row.email || "",
        campaignId,
      });
    })

    .on("end", resolve)

    .on("error", reject);
});

      if (results.length > 0) {
        await Contact.insertMany(
          results
        );
      }

      await Campaign.findByIdAndUpdate(
        campaignId,
        {
          totalContacts:
            results.length,
        }
      );

      if (
        fs.existsSync(filePath)
      ) {
        fs.unlinkSync(filePath);
      }

      console.log(
        `✅ ${results.length} contacts imported`
      );

      return true;

    } catch (error) {
      console.log(
        "CSV WORKER ERROR:",
        error
      );

      throw error;
    }
  },

  {
    connection: redis,
  }
);

export default worker;