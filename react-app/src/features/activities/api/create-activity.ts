import { api } from "@/lib/axios";
import type { ActivitiesData, ApiResponse } from "@/types/api";

export const createActivity = (
    groupId: string,
    title: string,
    proposedTime: string,
    description?: string,
): Promise<ApiResponse<ActivitiesData>> => {
    return api.post(`/groups/${groupId}/activities`, { title, proposedTime, description });
};
