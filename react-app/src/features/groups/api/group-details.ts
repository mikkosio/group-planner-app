import { api } from "@/lib/axios";
import type { ApiResponse } from "@/types/api";
import type { Group, Membership, User } from "@/types/models";

type GroupMember = Membership & {
    user: Pick<User, "id" | "name" | "email" | "avatar">;
};

type GroupDetails = Group & {
    creator: Pick<User, "id" | "name" | "email" | "avatar">;
    memberships: GroupMember[];
};

export type GroupDetailsData = {
    group: GroupDetails;
};

export const getGroupDetails = (groupId: string): Promise<ApiResponse<GroupDetailsData>> => {
    return api.get(`/groups/${groupId}`);
};
