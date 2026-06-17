import Campaign from "../models/Campaign.js";

export const getDashboard =
  async (req, res) => {
    const campaigns =
      await Campaign.find({
        userId: req.user.id,
      });

    const totalCampaigns =
      campaigns.length;

    const totalContacts =
      campaigns.reduce(
        (sum, c) =>
          sum +
          (c.totalContacts || 0),
        0
      );

    const totalSent =
      campaigns.reduce(
        (sum, c) =>
          sum +
          (c.sentCount || 0),
        0
      );

    res.json({
      success: true,
      totalCampaigns,
      totalContacts,
      totalSent,
    });
  };