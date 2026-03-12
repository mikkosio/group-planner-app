import type { Membership, User } from "./models";

export type ApiResponse<T> = {
    success: boolean;
    message: string;
    data: T;
};

export type AuthData = {
    token: string;
    user: User;
};

export type MeData = {
    user: User;
};

export type MembershipData = {
  membership: Membership;
};
