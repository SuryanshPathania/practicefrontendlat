import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "./Login.css";

const Login = () => {
  // State management for form data
  // Uses a single state object to handle multiple input fields
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // Destructure form data for easier access
  const { email, password } = formData;

  // Navigation hook from react-router-dom
  // Allows programmatic navigation between routes
  const navigate = useNavigate();

  // Dynamic input change handler
  // Uses computed property name to update specific form field
  // Spreads existing form data to maintain other field values
  const onChange = (e) =>
    setFormData({ 
      ...formData, 
      [e.target.name]: e.target.value 
    });

  // Async form submission handler
  const onSubmit = async (e) => {
    // Prevent default form submission behavior
    e.preventDefault();

    // Create user object from form data
    const user = { email, password };

    try {
      // Axios configuration for JSON content type
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      // Convert user object to JSON string
      const body = JSON.stringify(user);

      // Make POST request to login endpoint
      const res = await axios.post(
        "https://assign-back.vercel.app/api/users/login",
        body,
        config
      );

      // Store authentication token in localStorage
      // Token will be used for subsequent authenticated requests
      localStorage.setItem("token", res.data.token);

      // Log server response (for debugging)
      console.log(res.data);

      // Navigate to dashboard after successful login
      // Replace: true prevents going back to login page
      navigate("/dashboard", { replace: true });
    } catch (err) {
      // Error handling
      // Logs either specific error response or general error message
      console.error(err.response ? err.response.data : err.message);
    }
  };

  return (
    <div className="login-container">
      <div className="login-form-container">
        {/* Animated heading using Framer Motion */}
        <motion.h2
          // Initial state (hidden and slightly above final position)
          initial={{ opacity: 0, y: -20 }}
          // Animate to fully visible at original position
          animate={{ opacity: 1, y: 0 }}
          // Smooth transition effect
          transition={{ duration: 0.5 }}
        >
          Login to Your Account
        </motion.h2>

        {/* Login form with controlled inputs */}
        <form onSubmit={onSubmit} className="space-y-4">
          {/* Email input */}
          <div>
            <input
              type="email"
              placeholder="Email Address"
              name="email"
              value={email}
              onChange={onChange}
              required
            />
          </div>

          {/* Password input */}
          <div>
            <input
              type="password"
              placeholder="Password"
              name="password"
              value={password}
              onChange={onChange}
              required
            />
          </div>

          {/* Submit button */}
          <button type="submit">Login</button>
        </form>

        {/* Navigation to registration page */}
        <div className="text-center mt-6">
          <a 
            // Use navigation to switch to register page
            onClick={() => navigate("/register", { replace: true })}
          >
            Don't have an account? Sign up
          </a>
        </div>
      </div>
    </div>
  );
};

export default Login;