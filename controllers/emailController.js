import nodemailer from "nodemailer";

// TRANSPORTER
const transporter =
  nodemailer.createTransport({
    service: "gmail",

    auth: {
      user: process.env.EMAIL_USER,

      pass: process.env.EMAIL_PASS,
    },
  });

// SEND EMAIL
export const sendEmail =
  async (req, res) => {
    try {
      const {
        to,
        subject,
        message,
      } = req.body;

      const mailOptions = {
        from: process.env.EMAIL_USER,

        to,

        subject,

        html: `
          <div style="
            font-family:Arial;
            padding:20px;
          ">
            <h2>
              VisionX Notification
            </h2>

            <p>${message}</p>

            <hr />

            <small>
              Sent from VisionX CRM
            </small>
          </div>
        `,
      };

      await transporter.sendMail(
        mailOptions
      );

      res.json({
        success: true,
        message: "Email sent",
      });

    } catch (error) {
      console.log(error);

      res.status(500).json({
        message:
          "Email sending failed",
      });
    }
  };