import Campaign from "../models/Campaign.js";

// ==============================
// CREATE CAMPAIGN
// ==============================

export const createCampaign =
  async (req, res) => {
    try {
      const {
        name,
        type,
      } = req.body;

      // CREATE
      const campaign =
        await Campaign.create({
          name,

          type,

          status: "Draft",

          userId:
            req.user.id,
        });

      res.json({
        success: true,

        campaign,
      });

    } catch (error) {
      console.log(error);

      res.status(500).json({
        message:
          error.message,
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