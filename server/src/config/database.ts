import { PrismaClient } from "@prisma/client";
import { logger } from "./logger";

/**
 * Initialize Prisma Client and connect to the database.
 * Logs the connection status and handles any connection errors.
 */
const prisma = new PrismaClient({
  log:
    process.env.NODE_ENV === "development"
      ? ["query", "error", "warn"]
      : ["error"],
});

prisma
  .$connect()
  .then(() => {
    logger.info("Database connected successfully");
  })
  .catch((error: Error) => {
    logger.error("Database connection failed:", error);
    process.exit(1);
  });

export default prisma;
