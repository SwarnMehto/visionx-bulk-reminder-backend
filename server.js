import fs from "fs";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import campaignRoutes from "./routes/campaignRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import bulkRoutes from "./routes/bulkRoutes.js";
import emailRoutes from "./routes/emailRoutes.js";
import whatsappRoutes from "./routes/whatsappRoutes.js";
import redis from "./config/redis.js";
import clientRoutes from "./routes/clientRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import "./workers/csvWorker.js";
import { csvQueue } from "./queues/csvQueue.js";



await redis.set("test", "ok");
console.log(await redis.get("test"));

await csvQueue.obliterate({ force: true });
console.log("Queue Cleared");
dotenv.config();
console.log("MONGO:", !!process.env.MONGO_URI);
console.log("REDIS:", !!process.env.REDIS_URL);
console.log("JWT:", !!process.env.JWT_SECRET);
console.log("REDIS URL =", process.env.REDIS_URL);
const app = express();

// DB
connectDB();

// 🔥 CREATE UPLOADS FOLDER (CRITICAL FOR RENDER)
if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}

// MIDDLEWARE
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/campaigns", campaignRoutes);
app.use("/api/contacts", contactRoutes);
app.use("/api/bulk", bulkRoutes);
app.use("/api/email", emailRoutes);
app.use("/api/whatsapp", whatsappRoutes);
app.use("/api/clients", clientRoutes);
app.use("/api/dashboard", dashboardRoutes);
// TEST
app.get("/", (req, res) => {
  res.send("🚀 VisionX Backend Running");
});

// ERROR HANDLER (IMPORTANT)
app.use((err, req, res, next) => {
  console.error("GLOBAL ERROR:", err);

  res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});