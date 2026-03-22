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
    updateGroup,
    deleteGroup,
    joinGroup,
    unjoinGroup,
} from "../controllers/groups.controller";
import { isGroupMember, isGroupCreator } from "../middlewares/groupMiddleware";

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

export { createGroupSchema, updateGroupSchema, joinGroupSchema };
export default router;
