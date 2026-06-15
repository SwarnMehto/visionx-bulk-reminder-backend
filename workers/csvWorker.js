import { Worker } from "bullmq";
import redis from "../config/redis.js";

const worker = new Worker(
  "csv-upload",
  async (job) => {
    console.log("Processing job:", job.id);
  },
  {
    connection: redis,
  }
);

export default worker;