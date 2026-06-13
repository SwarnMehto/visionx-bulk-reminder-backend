import axios from "axios";

// SEND WHATSAPP MESSAGE
export const sendWhatsAppMessage =
  async (req, res) => {
    try {
      const { phone, message } =
        req.body;

      const response = await axios.post(
        `https://graph.facebook.com/v19.0/${process.env.WHATSAPP_PHONE_ID}/messages`,
        {
          messaging_product: "whatsapp",

          to: phone,

          type: "text",

          text: {
            body: message,
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

      res.json({
        success: true,
        response: response.data,
      });

    } catch (error) {
      console.log(
        error.response?.data || error.message
      );

      res.status(500).json({
        message: "WhatsApp send failed",
      });
    }
  };