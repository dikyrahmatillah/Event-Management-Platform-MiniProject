import { Queue } from "bullmq";
import { redisConnection } from "@/configs/redis.config.js";

export const orderQueue = new Queue("order", {
  connection: redisConnection,
});
