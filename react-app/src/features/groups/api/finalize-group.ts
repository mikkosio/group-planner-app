import { api } from "@/lib/axios";
import type { ApiResponse } from "@/types/api";
import type { Group } from "@/types/models";

export const finalizeGroup = (groupId: string, activityId: string): Promise<ApiResponse<{ group: Group }>> => {
    return api.patch(`/groups/${groupId}/finalize`, { activityId });
};
