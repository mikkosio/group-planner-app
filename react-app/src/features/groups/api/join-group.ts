import { api } from "@/lib/axios";
import type { ApiResponse, MembershipData } from "@/types/api";

export const joinGroup = (inviteCode: string): Promise<ApiResponse<MembershipData>> => {
    return api.post("/groups/join", { inviteCode });
};
