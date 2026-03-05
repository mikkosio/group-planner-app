// import React, { useState } from "react";
import GoogleIcon from "@mui/icons-material/Google";
import AppleIcon from "@mui/icons-material/Apple";
import GatherlyLogo from "../../assets/gatherlylogo.png";
import "./SignUp.css";

const SignUpPage = () => {
  return (
    <div>
      <div>
        <img className="signup-logo" src={GatherlyLogo} alt="Gatherly Logo" />
        <h1>Gatherly</h1>
      </div>
      <h2>Registration</h2>
      <form className="signup-form">
        <div className="signup-row signup-row--two">
          <div className="signup-field">
            <label htmlFor="firstName">First Name</label>
            <input placeholder="Eg. John" type="text" id="firstName" />
          </div>
          <div className="signup-field">
            <label htmlFor="lastName">Last Name</label>
            <input placeholder="Eg. Smith" type="text" id="lastName" />
          </div>
        </div>

        <div className="signup-row">
          <label htmlFor="email">Email</label>
          <input
            placeholder="Eg. john.smith@example.com"
            type="email"
            id="email"
          />
        </div>

        <div className="signup-row">
          <label htmlFor="password">Password</label>
          <input
            placeholder="Enter your password"
            type="password"
            id="password"
          />
        </div>

        <div className="signup-row">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            placeholder="Confirm your password"
            type="password"
            id="confirmPassword"
          />
        </div>

        <button className="signup-button" type="submit">
          Sign Up
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
        Already have an account? <a href="/login">Log in</a>
      </p>
    </div>
  );
};

export default SignUpPage;
