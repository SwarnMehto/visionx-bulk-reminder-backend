import dns from "dns";

// DNS FIX
dns.setServers(["1.1.1.1", "8.8.8.8"]);

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import whatsappRoutes from "./routes/whatsappRoutes.js";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import campaignRoutes from "./routes/campaignRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import bulkRoutes from "./routes/bulkRoutes.js";
import emailRoutes from "./routes/emailRoutes.js";


dotenv.config();

const app = express();

// DATABASE CONNECT
connectDB();

// MIDDLEWARE
app.use(cors());
app.use(express.json());

// ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/campaigns", campaignRoutes);
app.use("/api/contacts", contactRoutes);
app.use("/api/whatsapp", whatsappRoutes);
app.use("/api/bulk", bulkRoutes);
app.use("/api/email", emailRoutes);

// TEST ROUTE
app.get("/", (req, res) => {
  res.send("🚀 VisionX Backend Running");
});

// SERVER
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});