import { Router } from "express";
import { protect } from "../middlewares/authMiddleware";
import { validateRequest } from "../middlewares/validateRequest";
import {
    createGroupSchema,
    updateGroupSchema,
    joinGroupSchema,
    finalizeGroupSchema,
} from "../validators/groups.validator";
import {
    createGroup,
    getMyGroups,
    getGroupById,
    updateGroup,
    deleteGroup,
    joinGroup,
    unjoinGroup,
    finalizeGroup,
} from "../controllers/groups.controller";
import { isGroupMember, isGroupCreator, preventFinalizedModifications } from "../middlewares/groupMiddleware";
import activitiesRouter from "./activities.routes";

const router = Router();

// All group routes require authentication (only member can view their own groups)
router.use(protect);

//=============================== CORE ENDPOINTS ===============================
router.post("/",     validateRequest(createGroupSchema), createGroup);
router.get("/",      getMyGroups);
router.post("/join", validateRequest(joinGroupSchema), joinGroup);
router.get("/:id",   isGroupMember, getGroupById);

//=============================== PRIVILEGED ENDPOINTS ===============================
router.put("/:id",         isGroupMember, isGroupCreator, validateRequest(updateGroupSchema), updateGroup);
router.delete("/:id",      isGroupMember, isGroupCreator, deleteGroup);
router.post("/:id/unjoin", isGroupMember, unjoinGroup);
router.patch("/:id/finalize", isGroupMember, isGroupCreator, validateRequest(finalizeGroupSchema), finalizeGroup);

// Mount activities routes with finalization check
// GET requests allowed on finalized groups, but POST/PUT/DELETE are blocked
router.use("/:id/activities", isGroupMember, activitiesRouter);

export { createGroupSchema, updateGroupSchema, joinGroupSchema, finalizeGroupSchema };
export default router;
