import { Router } from "express";
import authRoutes from "./auth.routes";

const router = Router();

// Health check for API
router.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "API is running",
    version: process.env.API_VERSION || "v1",
  });
});

router.use("/auth", authRoutes);

export default router;
