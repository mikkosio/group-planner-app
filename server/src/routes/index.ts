import { Router } from "express";
import authRoutes from "./auth.routes";
import groupRoutes from "./groups.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/groups", groupRoutes);

export default router;
