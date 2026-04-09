import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import userEvent from "@testing-library/user-event";
import CreateActivityDialog from "@/features/activities/components/CreateActivityDialog";
import { createActivity } from "@/features/activities/api/create-activity";
import dayjs from "dayjs";

vi.mock("@/features/activities/api/create-activity", () => ({
    createActivity: vi.fn(),
}));

const mockedCreateActivity = vi.mocked(createActivity);

describe("CreateActivityDialog", () => {
    let user: ReturnType<typeof userEvent.setup>;
    beforeEach(() => {
        user = userEvent.setup({ delay: null });
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    const defaultProps = {
        open: true,
        onClose: vi.fn(),
        groupId: "group123",
        loadGroupDetails: vi.fn(),
    };

    describe("Form Validation", () => {
        it("validates that title is at least 3 characters", async () => {
            render(<CreateActivityDialog {...defaultProps} />);

            const titleInput = screen.getByLabelText(/title/i);
            fireEvent.change(titleInput, { target: { value: "Hi" } })

            await user.click(screen.getByRole("button", { name: /create/i }));

            expect(
                await screen.findByText(/title must be at least 3 characters/i)
            ).toBeInTheDocument();
        });

        it("validates that title is under 60 characters", async () => {
            render(<CreateActivityDialog {...defaultProps} />);

            const titleInput = screen.getByLabelText(/title/i);
            const longTitle = "a".repeat(61);
            fireEvent.change(titleInput, { target: { value: longTitle } })

            await user.click(screen.getByRole("button", { name: /create/i }));

            expect(
                await screen.findByText(/title must be under 60 characters/i)
            ).toBeInTheDocument();
        });

        it("rejects past date", async () => {
            render(<CreateActivityDialog {...defaultProps} />);

            const titleInput = screen.getByLabelText(/title/i);
            fireEvent.change(titleInput, { target: { value: "Test Title" } })

            const dateInputs = screen.getAllByDisplayValue("");
            const dateInput = dateInputs[0];
            fireEvent.change(dateInput, { target: { value: "01/01/2000" } })

            const timeInputs = screen.getAllByDisplayValue("");
            const timeInput = timeInputs[0];
            fireEvent.change(timeInput, { target: { value: "12:00 PM" } })
            
            await user.click(screen.getByRole("button", { name: /create/i }));

            expect(
                await screen.findByText(/proposed date cannot be in the past/i)
            ).toBeInTheDocument();
        });


        it("rejects past time", async () => {
            render(<CreateActivityDialog {...defaultProps} />);

            const titleInput = screen.getByLabelText(/title/i);
            fireEvent.change(titleInput, { target: { value: "Test Title" } })

            // Set date to today
            const today = dayjs().format("MM/DD/YYYY");
            const dateInputs = screen.getAllByDisplayValue("");
            const dateInput = dateInputs[0];
            fireEvent.change(dateInput, { target: { value: today } })

            // Try to set past time
            const pastTime = dayjs().subtract(1, "hour").format("hh:mm A");
            const timeInputs = screen.getAllByDisplayValue("");
            const timeInput = timeInputs[0];
            fireEvent.change(timeInput, { target: { value: pastTime} })

            await user.click(screen.getByRole("button", { name: /create/i }));

            expect(
                await screen.findByText(/proposed time cannot be in the past/i)
            ).toBeInTheDocument();
        });
    });

    describe("Form Submission", () => {
        it("submits with all required fields", async () => {
            const user = userEvent.setup();
            const title = "Team Lunch"
            const date = dayjs().add(7, "day").format("MM/DD/YYYY");
            const time = "12:00 PM";
            const isoString = dayjs(`${date} ${time}`, "MM/DD/YYYY hh:mm A").toISOString();

            mockedCreateActivity.mockResolvedValue({
                success: true,
                message: "Activity created",
            } as any);

            render(<CreateActivityDialog {...defaultProps} />);

            const titleInput = screen.getByLabelText(/title/i);
            fireEvent.change(titleInput, { target: { value: title } })

            const dateInputs = screen.getAllByDisplayValue("");
            const dateInput = dateInputs[0];
            fireEvent.change(dateInput, { target: { value: date } })

            const timeInputs = screen.getAllByDisplayValue("");
            const timeInput = timeInputs[0];
            fireEvent.change(timeInput, { target: { value: time} })

            await user.click(screen.getByRole("button", { name: /create/i }));

            await waitFor(() => {
                expect(mockedCreateActivity).toHaveBeenCalledWith(
                    "group123",
                    "Team Lunch",
                    expect.stringContaining(isoString),
                    ""
                );
            });
        });
    });

    describe("Error Handling", () => {
        const title = "Team Lunch";
        const date = "12/25/2026"
        const time = "12:00 PM";

        const fillDialogInputs = () => {
            const titleInput = screen.getByLabelText(/title/i);
            fireEvent.change(titleInput, { target: { value: title } })
            const dateInputs = screen.getAllByDisplayValue("");
            const dateField = dateInputs[0];
            fireEvent.change(dateField, { target: { value: date } })

            const timeInputs = screen.getAllByDisplayValue("");
            const timeField = timeInputs[0];
            fireEvent.change(timeField, { target: { value: time } })
        };

        it("displays generic error message on API exception", async () => {
            const user = userEvent.setup();

            // Mock generic error
            mockedCreateActivity.mockRejectedValue(new Error("Network error"));

            render(<CreateActivityDialog {...defaultProps} />);

            // Create activity
            fillDialogInputs();
            await user.click(screen.getByRole("button", { name: /create/i }));

            expect(
                await screen.findByText(/failed to create activity/i)
            ).toBeInTheDocument();
        });

        it("displays error response message from server", async () => {
            const user = userEvent.setup();
            const errorMessage = "Group is already finalized";

            // Mock server error
            mockedCreateActivity.mockRejectedValueOnce({
                response: {
                    data: {
                        message: errorMessage
                    }
                },
                isAxiosError: true,
            });

            render(<CreateActivityDialog {...defaultProps} />);

            // Create activity
            fillDialogInputs();
            await user.click(screen.getByRole("button", { name: /create/i }));

            // Get error message component
            const errorComponent = screen.getByRole("alert");

            // Assert error component to have right message
            expect(errorComponent).toHaveTextContent(errorMessage);
        });
    });
});
