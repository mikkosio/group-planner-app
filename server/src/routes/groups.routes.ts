import { Router } from "express";
import { protect } from "../middlewares/authMiddleware";
import { validateRequest } from "../middlewares/validateRequest";
import {
    createGroupSchema,
    updateGroupSchema,
    joinGroupSchema,
} from "../validators/groups.validator";

const router = Router();

// All group routes require authentication (only member can view their own groups)
router.use(protect);

//=============================== TODO: CORE ENDPOINTS ===============================
// POST   /api/v1/groups          — Create group (+ auto-enrol creator as Admin)
// GET    /api/v1/groups          — List all groups the user is a member of
// GET    /api/v1/groups/:id      — Get full group details (members only)

//=============================== TODO: PRIVILEGED ENDPOINTS ===============================
// PUT    /api/v1/groups/:id      — Update group name/description (creator only)
// DELETE /api/v1/groups/:id      — Delete group (creator only)
// POST   /api/v1/groups/:id/join   — Join group via invite code
// POST   /api/v1/groups/:id/unjoin — Leave group (creator blocked)

export { createGroupSchema, updateGroupSchema, joinGroupSchema };
export default router;
