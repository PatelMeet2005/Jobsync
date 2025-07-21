import React, { useState } from "react";
import "./Register.css";

const Signup = ({ onClose, switchToLogin }) => {
  const [user, setUser] = useState({
    userFirstName: "",
    userLastName: "",
    userEmail: "",
    userPassword: "",
    userPhoneNumber: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormsubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:8000/user/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Registration failed");
      }

      const data = await response.json();
      console.log("Registration successful:", data);

      setUser({
        userFirstName: "",
        userLastName: "",
        userEmail: "",
        userPassword: "",
        userPhoneNumber: "",
      });

      alert("Registration successful!");
    } catch (error) {
      console.error("Error during registration:", error.message);
      alert("Registration failed: " + error.message);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-btn" onClick={onClose}>
          ×
        </button>
        <div className="heading">
          <h2>Sign Up</h2>
          <p>Create your account.</p>
          <div className="login-switch">
            <p>Already have an account?</p>
            <a href="#" onClick={switchToLogin}>
              Sign in
            </a>
          </div>
          <form className="register-form" onSubmit={handleFormsubmit}>
            <div className="name-row">
              <div className="input-group">
                <label htmlFor="userFirstName">
                  <b>First Name</b>
                </label>
                <input
                  id="userFirstName"
                  type="text"
                  name="userFirstName"
                  placeholder="Enter First Name"
                  required
                  value={user.userFirstName}
                  onChange={handleInputChange}
                />
              </div>

              <div className="input-group">
                <label htmlFor="userLastName">
                  <b>Last Name</b>
                </label>
                <input
                  id="userLastName"
                  type="text"
                  name="userLastName"
                  placeholder="Enter Last Name"
                  required
                  value={user.userLastName}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <label htmlFor="userEmail">
              <b>Email</b>
            </label>
            <input
              type="email"
              name="userEmail"
              placeholder="Enter Email"
              required
              value={user.userEmail}
              onChange={handleInputChange}
            />

            <label htmlFor="userPassword">
              <b>Password</b>
            </label>
            <input
              type="password"
              name="userPassword"
              placeholder="Enter Password"
              required
              value={user.userPassword}
              onChange={handleInputChange}
            />

            <label htmlFor="userPhoneNumber">
              <b>Phone Number</b>
            </label>
            <input
              type="tel"
              name="userPhoneNumber"
              placeholder="Enter Phone Number"
              required
              value={user.userPhoneNumber}
              onChange={handleInputChange}
            />

            <button type="submit">Register</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
