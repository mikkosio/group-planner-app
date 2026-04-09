import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import GroupDetails from "@/pages/GroupDetails";
import { getGroupDetails } from "@/features/groups/api/group-details";
import { useAuth } from "@/providers/AuthProvider";
/**
 * Tests the GroupDetails page, which displays information about a specific group, its members, and activities.
 * Covers loading state, successful data rendering, and error handling.
 * Loading state: Verifies that a progress indicator is shown while fetching group details.
 * Successful data rendering: Mocks the API response to return group details and checks that the group name, members, and admin controls are displayed correctly.
 * Share invite dialog: Tests that clicking the "Share Invite" button opens the corresponding dialog.
 * Error handling: Mocks an API failure and verifies that an error message is shown to the user.
 */
vi.mock("@/features/groups/api/group-details", () => ({
    getGroupDetails: vi.fn(),
}));

vi.mock("@/providers/AuthProvider", () => ({
    useAuth: vi.fn(),
}));

vi.mock("@/features/groups/components/ShareInviteDialog", () => ({
    default: ({ open }: { open: boolean }) => (open ? <div>Share Invite Dialog</div> : null),
}));

vi.mock("@/features/groups/components/AdminControls", () => ({
    default: () => <div>Admin Controls</div>,
}));

vi.mock("@/features/activities/components/ActivitiesList", () => ({
    default: () => <div>Activities List</div>,
}));

vi.mock("@/features/activities/components/CreateActivityDialog", () => ({
    default: ({ open }: { open: boolean }) => (open ? <div>Create Activity Dialog</div> : null),
}));

const mockedGetGroupDetails = vi.mocked(getGroupDetails);
const mockedUseAuth = vi.mocked(useAuth);

const mockGroup = {
    id: "g1",
    name: "Weekend Crew",
    createdAt: "2026-04-08T00:00:00.000Z",
    creatorId: "u1",
    inviteCode: "ABC123",
    memberships: [
        {
            userId: "u1",
            role: "CREATOR",
            user: {
                id: "u1",
                name: "Amrit",
                email: "amrit@test.com",
                avatar: null,
            },
        },
    ],
};

describe("GroupDetails", () => {
    afterEach(() => {
        vi.clearAllMocks();
    });

    it("renders group details for the creator", async () => {
        mockedUseAuth.mockReturnValue({
            user: { id: "u1", name: "Amrit" },
        } as any);

        mockedGetGroupDetails.mockResolvedValue({
            data: { group: mockGroup },
        } as any);

        render(
            <MemoryRouter initialEntries={["/groups/g1"]}>
                <Routes>
                    <Route path="/groups/:id" element={<GroupDetails />} />
                </Routes>
            </MemoryRouter>,
        );

        expect(screen.getByRole("progressbar")).toBeInTheDocument();
        expect(await screen.findByText("Weekend Crew")).toBeInTheDocument();
        expect(screen.getByText(/members \(1\)/i)).toBeInTheDocument();
        expect(screen.getByText("Admin Controls")).toBeInTheDocument();
    });

    it("opens the share invite dialog", async () => {
        const user = userEvent.setup();

        mockedUseAuth.mockReturnValue({
            user: { id: "u1", name: "Amrit" },
        } as any);

        mockedGetGroupDetails.mockResolvedValue({
            data: { group: mockGroup },
        } as any);

        render(
            <MemoryRouter initialEntries={["/groups/g1"]}>
                <Routes>
                    <Route path="/groups/:id" element={<GroupDetails />} />
                </Routes>
            </MemoryRouter>,
        );

        await screen.findByText("Weekend Crew");
        await user.click(screen.getByLabelText(/share invite/i));

        expect(screen.getByText("Share Invite Dialog")).toBeInTheDocument();
    });

    it("shows an error state when the API fails", async () => {
        mockedUseAuth.mockReturnValue({
            user: { id: "u1", name: "Amrit" },
        } as any);

        const errorMessage = "Network Error";
        mockedGetGroupDetails.mockRejectedValue(new Error(errorMessage));

        render(
            <MemoryRouter initialEntries={["/groups/g1"]}>
                <Routes>
                    <Route path="/groups/:id" element={<GroupDetails />} />
                </Routes>
            </MemoryRouter>,
        );

        expect(await screen.findByText(errorMessage)).toBeInTheDocument();
    });
});
