import { api } from "@/lib/axios";
import type { ActivitiesData, ApiResponse } from "@/types/api";

export const getAllActivities = (groupId: string): Promise<ApiResponse<ActivitiesData>> => {
    return api.get(`/groups/${groupId}/activities`);
};
