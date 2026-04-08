import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import userEvent from "@testing-library/user-event";
import CreateGroup from "@/pages/CreateGroup";
import { createGroup } from "@/features/groups/api/create-group";

vi.mock("@/features/groups/api/create-group", () => ({
    createGroup: vi.fn(),
}));

vi.mock("@/features/groups/components/CreateGroupSuccess", () => ({
    default: ({ inviteCode, groupUrl }: { inviteCode: string; groupUrl: string }) => (
        <div>
            Group created: {inviteCode} {groupUrl}
        </div>
    ),
}));

const mockedCreateGroup = vi.mocked(createGroup);

describe("CreateGroup", () => {
    afterEach(() => {
        vi.clearAllMocks();
    });

    it("validates short group names", async () => {
        const user = userEvent.setup();

        render(<CreateGroup />);

        await user.type(screen.getByLabelText(/group name/i), "Hi");
        await user.click(screen.getByRole("button", { name: /create group/i }));

        expect(
            await screen.findByText(/group name must be at least 3 characters/i),
        ).toBeInTheDocument();
    });

    it("submits and shows the success state", async () => {
        const user = userEvent.setup();

        mockedCreateGroup.mockResolvedValue({
            data: {
                group: {
                    id: "g1",
                    inviteCode: "ABC123",
                },
            },
        } as any);

        render(<CreateGroup />);

        await user.type(screen.getByLabelText(/group name/i), "Weekend Crew");
        await user.type(screen.getByLabelText(/description/i), "Brunch plans");
        await user.click(screen.getByRole("button", { name: /create group/i }));

        expect(mockedCreateGroup).toHaveBeenCalledWith("Weekend Crew", "Brunch plans");
        expect(await screen.findByText(/group created:/i)).toBeInTheDocument();
    });
});
