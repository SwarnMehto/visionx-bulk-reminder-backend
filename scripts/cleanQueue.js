import { csvQueue } from "../queues/csvQueue.js";

await csvQueue.drain();
await csvQueue.clean(0, 1000, "completed");
await csvQueue.clean(0, 1000, "failed");

console.log("Queue cleaned");
process.exit();