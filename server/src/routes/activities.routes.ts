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
} from "../controllers/activities.controller";
import {
    addVote,
    removeVote,
} from "../controllers/votes.controller";
import {
    isActivityInGroup,
    isActivityCreator,
    isGroupCreatorOrActivityCreator,
} from "../middlewares/activitiesMiddleware"

const router = Router({ mergeParams: true });

//=============================== ENDPOINTS ===============================
router.post("/", validateRequest(createActivitySchema), createActivity);

router.put(   "/:activityId", isActivityInGroup, isActivityCreator, validateRequest(updateActivitySchema), updateActivity);
router.delete("/:activityId", isActivityInGroup, isGroupCreatorOrActivityCreator, deleteActivity);

// Vote endpoints
router.post(  "/:activityId/vote", isActivityInGroup, addVote);
router.delete("/:activityId/vote", isActivityInGroup, removeVote);

export default router;