import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import LoginPage from "@/pages/Login";
import SignUpPage from "@/pages/SignUp";
import { AuthProvider } from "@/providers/AuthProvider";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom/vitest";

// Mock Auth API
const mockLogin = vi.fn();
const mockRegister = vi.fn();
vi.mock("@/providers/AuthProvider", () => ({
    AuthProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
    useAuth: () => ({
        login: mockLogin,
        register: mockRegister,
    }),
}));

// Mock react navigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => ({
    ...await vi.importActual('react-router-dom'),
    useNavigate: () => mockNavigate,
}));

/**
 * Test the login flow.
 * Tests inputting to the form, submitting the form, display error messages.
*/
describe("Login Flow Test", () => {
    let user: ReturnType<typeof userEvent.setup>;
    const email = "test@example.com";
    const password = "Test1234";
    
    const renderLogin = () => render(
        <MemoryRouter>
          <AuthProvider>
            <LoginPage />
          </AuthProvider>
        </MemoryRouter>
    );
    
    const fillLoginForm = () => {
        fireEvent.change(screen.getByLabelText(/email/i), { target: { value: email } });
        fireEvent.change(screen.getByLabelText(/password/i), { target: { value: password } });
    };
    
    beforeEach(() => {
        user = userEvent.setup({ delay: null });
    });
    
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("typing into login fields", async () => {
        renderLogin();

        // Find input fields
        const emailField = screen.getByLabelText(/email/i);
        const passwordField = screen.getByLabelText(/password/i);

        // Simulate user typing
        await user.type(emailField, email);
        await user.type(passwordField, password);

        // Assert values
        expect(emailField).toHaveValue(email);
        expect(passwordField).toHaveValue(password);
    });

    it("submitting login form", async () => {
        // Mock login response
        mockLogin.mockResolvedValueOnce({
            success: true,
            message: "mock response",
            data: {
                token: "fake-token",
                user: {
                    id: "1",
                    name: "Test User",
                    email: email,
                    avatar: null,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                }
            }
        })
        
        renderLogin();

        // Fill Form
        fillLoginForm();

        // Submit button
        const submitButton = screen.getByTestId("submit-button");
        await user.click(submitButton);

        // Assert API called with right data
        expect(mockLogin).toHaveBeenCalledWith(email, password);
        // Assert navigate to right route
        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith("/home", { replace: true });
        });
    });

    it("display error login message from API", async () => {
        const errorMessage = "Invalid email or password";

        // Mock invalid credentials response to login
        mockLogin.mockRejectedValueOnce({
            response: {
                data: {
                    message: errorMessage
                }
            },
            isAxiosError: true,
        })
        
        renderLogin();

        // Submit form
        fillLoginForm();
        await user.click(screen.getByTestId("submit-button"));

        // Get error message component
        const errorComponent = screen.getByRole("alert");

        // Assert error component to have right message
        expect(errorComponent).toHaveTextContent(errorMessage);
    });
});

/**
 * Test the signup flow.
 * Tests inputting to the form, submitting the form, display error messages.
 */
describe("Signup Flow Test", () => {
    let user: ReturnType<typeof userEvent.setup>;
    const firstName = "Test";
    const lastName = "User";
    const email = "test@example.com";
    const password = "Test1234";
    const confirmPassword = "Test1234";
    
    const renderSignup = () => render(
        <MemoryRouter>
          <AuthProvider>
            <SignUpPage />
          </AuthProvider>
        </MemoryRouter>
    );
    
    const fillSignupForm = () => {
        fireEvent.change(screen.getByLabelText(/first name/i), { target: { value: firstName } });
        fireEvent.change(screen.getByLabelText(/last name/i), { target: { value: lastName } });
        fireEvent.change(screen.getByLabelText(/email/i), { target: { value: email } });
        fireEvent.change(screen.getByLabelText(/^password/i), { target: { value: password } });
        fireEvent.change(screen.getByLabelText(/confirm password/i), { target: { value: confirmPassword } });
    };
    
    beforeEach(() => {
        user = userEvent.setup({ delay: null });
    });
    
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("typing into signup fields", async () => {
        renderSignup();

        // Find input fields
        const firstNameField = screen.getByLabelText(/first name/i);
        const lastNameField = screen.getByLabelText(/last name/i);
        const emailField = screen.getByLabelText(/email/i);
        const passwordField = screen.getByLabelText(/^password/i);
        const confirmPasswordField = screen.getByLabelText(/confirm password/i);

        // Simulate user typing
        await user.type(firstNameField, firstName);
        await user.type(lastNameField, lastName);
        await user.type(emailField, email);
        await user.type(passwordField, password);
        await user.type(confirmPasswordField, confirmPassword);

        // Assert values
        expect(firstNameField).toHaveValue(firstName);
        expect(lastNameField).toHaveValue(lastName);
        expect(emailField).toHaveValue(email);
        expect(passwordField).toHaveValue(password);
        expect(confirmPasswordField).toHaveValue(confirmPassword);
    });

    it("submitting signup form", async () => {
        const fullName = `${firstName} ${lastName}`;
        // Mock register response
        mockRegister.mockResolvedValueOnce({
            success: true,
            message: "Account created successfully",
            data: {
                token: "fake-token",
                user: {
                    id: "1",
                    name: fullName,
                    email: email,
                    avatar: null,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                }
            }
        })
        
        renderSignup();

        // Fill Form
        fillSignupForm();

        // Submit button
        const submitButton = screen.getByRole("button", { name: /create account/i });
        await user.click(submitButton);

        // Assert API called with right data
        expect(mockRegister).toHaveBeenCalledWith(email, password, fullName);
        // Assert navigate to right route
        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith("/home", { replace: true });
        });
    });

    it("display error signup message from API", async () => {
        const errorMessage = "Email already exists";

        // Mock error response to register
        mockRegister.mockRejectedValueOnce({
            response: {
                data: {
                    message: errorMessage
                }
            },
            isAxiosError: true,
        })
        
        renderSignup();

        // Submit form
        fillSignupForm();
        await user.click(screen.getByRole("button", { name: /create account/i }));

        // Get error message component (Alert)
        const errorComponent = screen.getByRole("alert");

        // Assert error component to have right message
        expect(errorComponent).toHaveTextContent(errorMessage);
    });
});
