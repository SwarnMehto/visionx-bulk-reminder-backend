import axios from "axios";

import nodemailer from "nodemailer";

import Campaign from "../models/Campaign.js";

import Contact from "../models/Contact.js";

// ================= EMAIL TRANSPORT =================
const transporter =
  nodemailer.createTransport({
    service: "gmail",

    auth: {
      user: process.env.EMAIL_USER,

      pass: process.env.EMAIL_PASS,
    },
  });

// ================= LAUNCH CAMPAIGN =================
export const launchCampaign =
  async (req, res) => {
    try {
      const { campaignId } = req.body;

      // FIND CAMPAIGN
      const campaign =
        await Campaign.findById(
          campaignId
        );

      if (!campaign) {
        return res.status(404).json({
          message: "Campaign not found",
        });
      }

      // GET CONTACTS
      const contacts =
        await Contact.find({
          campaignId,
        });

      let successCount = 0;

      let failedCount = 0;

      // LOOP CONTACTS
      for (const contact of contacts) {
        try {
          // ================= WHATSAPP =================
          if (
            campaign.type === "whatsapp"
          ) {
            await axios.post(
              `https://graph.facebook.com/v19.0/${process.env.WHATSAPP_PHONE_ID}/messages`,

              {
                messaging_product:
                  "whatsapp",

                to: contact.phone,

                type: "text",

                text: {
                  body:
                    campaign.message ||
                    "Hello from VisionX 🚀",
                },
              },

              {
                headers: {
                  Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,

                  "Content-Type":
                    "application/json",
                },
              }
            );
          }

          // ================= EMAIL =================
          if (
            campaign.type === "email"
          ) {
            await transporter.sendMail({
              from:
                process.env.EMAIL_USER,

              to: contact.email,

              subject:
                campaign.subject ||
                "VisionX Campaign",

              html: `
                <div style="
                  font-family:Arial;
                  padding:20px;
                ">
                  <h2>
                    VisionX Campaign 🚀
                  </h2>

                  <p>
                    ${
                      campaign.message ||
                      ""
                    }
                  </p>

                  <hr />

                  <small>
                    Sent from VisionX CRM
                  </small>
                </div>
              `,
            });
          }

          // SUCCESS
          successCount++;

        } catch (error) {
          console.log(
            "FAILED:",
            contact.phone ||
              contact.email
          );

          console.log(error.message);

          failedCount++;
        }
      }

      // UPDATE CAMPAIGN
      campaign.sentCount =
        contacts.length;

      campaign.successCount =
        successCount;

      campaign.failedCount =
        failedCount;

      campaign.status = "completed";

      await campaign.save();

      // RESPONSE
      res.json({
        success: true,

        total: contacts.length,

        successCount,

        failedCount,
      });

    } catch (error) {
      console.log(error);

      res.status(500).json({
        message: error.message,
      });
    }
  };