import { createClient } from "redis";
import { logger } from "../logger/logger";

const redis = createClient({
   url: process.env.REDIS_URL,
});

redis.on("error", (err) => logger.error(err));

(async () => {
   await redis.connect();
})();

export { redis };
