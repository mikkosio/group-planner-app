import { api } from "@/lib/axios";
import type { ApiResponse } from "@/types/api";
import type { Group } from "@/types/models";

export type CreateGroupData = {
    group: Group;
};

export const createGroup = (
    name: string,
    description?: string,
): Promise<ApiResponse<CreateGroupData>> => {
    return api.post("/groups", { name, description });
};
