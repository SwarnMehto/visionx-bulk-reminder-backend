import Campaign from "../models/Campaign.js";
import Client from "../models/Client.js";
// ==============================
// CREATE CAMPAIGN
// ==============================

export const createCampaign =
  async (req, res) => {
    try {
      const {
        name,
        partyName,
        type,
        message,
        poster
      } = req.body;

      const campaign =
        await Campaign.create({
          name,
          partyName,
          type,
          message,
          status: "Draft",
          userId: req.user.id,
        });
        if (partyName) {
  const existingClient =
    await Client.findOne({
      name: partyName,
      userId: req.user.id,
    });

  if (!existingClient) {
    await Client.create({
      name: partyName,
      userId: req.user.id,
    });
  }
}

      res.json({
        success: true,
        campaign,
      });

    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  };

// ==============================
// GET ALL CAMPAIGNS
// ==============================

export const getCampaigns =
  async (req, res) => {
    try {
      const campaigns =
        await Campaign.find({
          userId:
            req.user.id,
        }).sort({
          createdAt: -1,
        });

      res.json({
        success: true,

        campaigns,
      });

    } catch (error) {
      res.status(500).json({
        message:
          error.message,
      });
    }
  };

// ==============================
// GET SINGLE CAMPAIGN
// ==============================

export const getSingleCampaign =
  async (req, res) => {
    try {
      const campaign =
        await Campaign.findById(
          req.params.id
        );

      res.json({
        success: true,

        campaign,
      });

    } catch (error) {
      res.status(500).json({
        message:
          error.message,
      });
    }
  };
  export const launchCampaign =
  async (req, res) => {
    try {
      const campaign =
        await Campaign.findById(
          req.params.id
        );

      if (!campaign) {
        return res.status(404).json({
          success: false,
          message:
            "Campaign not found",
        });
      }

      campaign.status =
        "Completed";

      await campaign.save();

      res.json({
        success: true,
        successCount: 100,
        failedCount: 0,
      });

    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  };
  export const updateCampaign =
  async (req, res) => {
    try {
      const campaign =
        await Campaign.findByIdAndUpdate(
          req.params.id,
          req.body,
          { new: true }
        );

      res.json({
        success: true,
        campaign,
      });

    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  };