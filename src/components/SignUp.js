import React, { useState } from "react"; // Import React and useState hook for managing component state
import axios from "axios"; // Import axios for making HTTP requests
import { useNavigate } from "react-router-dom"; // Import navigation hook from react-router
import "./SignUp.css"; // Import CSS styles for the SignUp component

const SignUp = () => {
  // Initialize state for form data using useState hook
  // Creates an object with name, email, and password fields, all initially empty
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  // Destructure form data and navigation hook for easier access
  const { name, email, password } = formData;
  const navigate = useNavigate(); // Create navigation function to programmatically change routes

  // Handler for input changes - updates the specific form field that was modified
  // Uses computed property name to dynamically update the correct form field
  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  // Async function to handle form submission
  const onSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior

    // Create a new user object with form data
    const newUser = { name, email, password };

    try {
      // Configure axios request headers
      const config = {
        headers: {
          "Content-Type": "application/json", // Specify content type as JSON
        },
      };

      // Convert user object to JSON string
      const body = JSON.stringify(newUser);

      // Send POST request to registration endpoint
      const res = await axios.post(
        "https://assign-back.vercel.app/api/users/register", // Backend registration API endpoint
        body, // JSON stringified user data
        config // Request configuration
      );

      // Log successful response
      console.log(res.data);

      // Navigate to login page after successful registration
      // 'replace: true' replaces current history entry instead of adding a new one
      navigate("/login", { replace: true });

    } catch (err) {
      // Error handling - log any errors during registration
      // Checks if there's a response from the server, otherwise logs general error message
      console.error(err.response ? err.response.data : err.message);
    }
  };

  // Render the signup form
  return (
    <div className="signup-container">
      <div className="signup-form-container">
        {/* Page title */}
        <h2 className="text-2xl font-bold mb-4 text-center">Sign Up</h2>

        {/* Form with onSubmit event handler */}
        <form onSubmit={onSubmit}>
          {/* Name input field */}
          <div className="mb-4">
            <input
              type="text"
              placeholder="Name"
              name="name"
              value={name}
              onChange={onChange}
              required
            />
          </div>

          {/* Email input field */}
          <div className="mb-4">
            <input
              type="email"
              placeholder="Email Address"
              name="email"
              value={email}
              onChange={onChange}
              required
            />
          </div>

          {/* Password input field */}
          <div className="mb-4">
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
          <div className="mb-4">
            <input type="submit" value="Register" />
          </div>
        </form>

        {/* Login link for existing users */}
        <div className="text-center mt-4">
          <p className="text-gray-600">
            Already have an account?{" "}
            <a onClick={() => navigate("/login", { replace: true })}>Login</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp; // Export the SignUp component as the default export