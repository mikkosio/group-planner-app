import { Router } from "express";
import { validateRequest } from "../middlewares/validateRequest";
import {
    createActivitySchema,
    updateActivitySchema,
} from "../validators/activities.validators";
import {
    createActivity,
    updateActivity,
    deleteActivity,
    getGroupActivities,
    getWinnerActivity,
    setWinnerActivity,
    getActivityById,
} from "../controllers/activities.controller";
import {
    addVote,
    removeVote,
} from "../controllers/votes.controller";
import {
    isActivityInGroup,
    isActivityCreator,
    isGroupCreatorOrActivityCreator,
} from "../middlewares/activitiesMiddleware";
import { isGroupCreator, preventFinalizedModifications } from "../middlewares/groupMiddleware";

const router = Router({ mergeParams: true });

//=============================== ENDPOINTS ===============================
// Read operations - allowed even on finalized groups
router.get( "/", getGroupActivities);
router.get("/winner", getWinnerActivity);
router.get("/:activityId", isActivityInGroup, getActivityById);

// Write operations - blocked on finalized groups
router.post("/", preventFinalizedModifications, validateRequest(createActivitySchema), createActivity);
router.post("/:activityId/set-winner", preventFinalizedModifications, isActivityInGroup, isGroupCreator, setWinnerActivity);
router.put("/:activityId", preventFinalizedModifications, isActivityInGroup, isActivityCreator, validateRequest(updateActivitySchema), updateActivity);
router.delete("/:activityId", preventFinalizedModifications, isActivityInGroup, isGroupCreatorOrActivityCreator, deleteActivity);

// Vote endpoints - blocked on finalized groups
router.post("/:activityId/vote", preventFinalizedModifications, isActivityInGroup, addVote);
router.delete("/:activityId/vote", preventFinalizedModifications, isActivityInGroup, removeVote);

export default router;