import axios from "axios";

import Campaign from "../models/Campaign.js";

import Contact from "../models/Contact.js";

// LAUNCH CAMPAIGN
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
          // WHATSAPP ONLY
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
                  body: campaign.message,
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

          successCount++;

        } catch (error) {
          console.log(
            "FAILED:",
            contact.phone
          );

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

      res.json({
        success: true,

        total: contacts.length,

        successCount,

        failedCount,
      });

    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  };