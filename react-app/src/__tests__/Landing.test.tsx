import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest"
import LandingPage from "@/pages/Landing";
import { MemoryRouter } from "react-router-dom";

/**
 * Initial test for Vitest setup.
 * Verifies that a component renders without errors.
 */
describe("Vitest Setup", () => {
    it("renders app name in Landing page", () => {
        render(
            <MemoryRouter>
                <LandingPage />
            </MemoryRouter>
        );

        expect(screen.getByText("Gatherly")).toBeInTheDocument();
    });
});
