import { Router } from "express";
import { protect } from "../middlewares/authMiddleware";
import { validateRequest } from "../middlewares/validateRequest";
import {
    createGroupSchema,
    updateGroupSchema,
    joinGroupSchema,
} from "../validators/groups.validator";
import {
    createGroup,
    getMyGroups,
    getGroupById,
} from "../controllers/groups.controller";

const router = Router();

// All group routes require authentication (only member can view their own groups)
router.use(protect);

//=============================== CORE ENDPOINTS ===============================
router.post("/", validateRequest(createGroupSchema), createGroup);
router.get("/", getMyGroups);
router.get("/:id", getGroupById);

//=============================== TODO: PRIVILEGED ENDPOINTS ===============================
// PUT    /api/v1/groups/:id      — Update group name/description (creator only)
// DELETE /api/v1/groups/:id      — Delete group (creator only)
// POST   /api/v1/groups/:id/join   — Join group via invite code
// POST   /api/v1/groups/:id/unjoin — Leave group (creator blocked)

export { createGroupSchema, updateGroupSchema, joinGroupSchema };
export default router;
