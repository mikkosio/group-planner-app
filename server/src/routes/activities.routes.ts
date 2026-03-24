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
    isActivityInGroup,
    isActivityCreator,
    isGroupCreatorOrActivityCreator,
} from "../middlewares/activitiesMiddleware"

const router = Router();

//=============================== ENDPOINTS ===============================
router.post("/", validateRequest(createActivitySchema), createActivity);

router.put(   "/:activityId", isActivityInGroup, isActivityCreator, validateRequest(updateActivitySchema), updateActivity);
router.delete("/:activityId", isActivityInGroup, isGroupCreatorOrActivityCreator, deleteActivity);

export default router;