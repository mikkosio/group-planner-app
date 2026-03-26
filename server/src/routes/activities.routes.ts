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
import { isGroupCreator } from "../middlewares/groupMiddleware";

const router = Router({ mergeParams: true });

//=============================== ENDPOINTS ===============================
router.get( "/", getGroupActivities);
router.post("/", validateRequest(createActivitySchema), createActivity);

router.get("/winner", getWinnerActivity);
router.post("/:activityId/set-winner", isActivityInGroup, isGroupCreator, setWinnerActivity);

router.get(   "/:activityId", isActivityInGroup, getActivityById);
router.put(   "/:activityId", isActivityInGroup, isActivityCreator, validateRequest(updateActivitySchema), updateActivity);
router.delete("/:activityId", isActivityInGroup, isGroupCreatorOrActivityCreator, deleteActivity);

// Vote endpoints
router.post(  "/:activityId/vote", isActivityInGroup, addVote);
router.delete("/:activityId/vote", isActivityInGroup, removeVote);

export default router;