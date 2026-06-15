import { Queue } from "bullmq";
import redis from "../config/redis.js";

export const csvQueue = new Queue("csv-upload", {
  connection: redis,
});