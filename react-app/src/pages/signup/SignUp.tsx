import { useState } from "react";
import GoogleIcon from "@mui/icons-material/Google";
import AppleIcon from "@mui/icons-material/Apple";
import GatherlyLogo from "../../assets/gatherlylogo.png";
import { useAuth } from "../../providers/AuthProvider";
import { useNavigate, Link } from "react-router-dom";
import "./SignUp.css";

const SignUpPage = () => {
    const { register } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        setIsLoading(true);
        try {
            const name = `${formData.firstName.trim()} ${formData.lastName.trim()}`.trim();
            await register(formData.email, formData.password, name || undefined);
            navigate("/home");
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("Registration failed. Please try again.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <div>
                <img className="signup-logo" src={GatherlyLogo} alt="Gatherly Logo" />
                <h1>Gatherly</h1>
            </div>
            <h2>Registration</h2>
            <form className="signup-form" onSubmit={handleSubmit}>
                <div className="signup-row signup-row--two">
                    <div className="signup-field">
                        <label htmlFor="firstName">First Name</label>
                        <input
                            placeholder="Eg. John"
                            type="text"
                            id="firstName"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="signup-field">
                        <label htmlFor="lastName">Last Name</label>
                        <input
                            placeholder="Eg. Smith"
                            type="text"
                            id="lastName"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>

                <div className="signup-row">
                    <label htmlFor="email">Email</label>
                    <input
                        placeholder="Eg. john.smith@example.com"
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="signup-row">
                    <label htmlFor="password">Password</label>
                    <input
                        placeholder="Enter your password"
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="signup-row">
                    <label htmlFor="confirmPassword">Confirm Password</label>
                    <input
                        placeholder="Confirm your password"
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                    />
                </div>

                {error && <p className="signup-error">{error}</p>}

                <button className="signup-button" type="submit" disabled={isLoading}>
                    {isLoading ? "Creating account..." : "Sign Up"}
                </button>
            </form>
            <div>
                <p>Or sign up with</p>
                <button className="button-with-icon" type="button">
                    <GoogleIcon aria-hidden="true" /> Google
                </button>
                <button className="button-with-icon" type="button">
                    <AppleIcon aria-hidden="true" /> Apple
                </button>
            </div>
            <p>
                Already have an account? <Link to="/login">Log in</Link>
            </p>
        </div>
    );
};

export default SignUpPage;
