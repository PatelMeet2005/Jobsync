import React, { useState } from "react";
import "./Register.css";

const Signup = ({ onClose, switchToLogin }) => {
  const [user, setUser] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    phonenumber: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormsubmit = async (e) => {
    e.preventDefault();
    // Here you would typically send the user data to your backend for registration
    console.log(user);
    // Reset the form after submission
    setUser({
      firstname: "",
      lastname: "",
      email: "",
      password: "",
      phonenumber: "",
    });
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
          <form onSubmit={handleFormsubmit}>
            <div className="name-row">
              <div className="input-group">
                  <label htmlFor="firstname">
              <b>First Name</b>
            </label>
            <input
            id="firstname"
              type="text"
              name="firstname"
              placeholder="Enter First Name"
              required
              value={user.firstname}
              onChange={handleInputChange}
            />
              </div>

            <div className="input-group">
                  <label htmlFor="lastname">
              <b>First Name</b>
            </label>
            <input
            id="lastname"
              type="text"
              name="lastname"
              placeholder="Enter Last Name"
              required
              value={user.firstname}
              onChange={handleInputChange}
            />
            </div>
            </div>

            <label htmlFor="email">
              <b>Email</b>
            </label>
            <input
              type="email"
              name="email"
              placeholder="Enter Email"
              required
              value={user.email}
              onChange={handleInputChange}
            />

            <label htmlFor="password">
              <b>Password</b>
            </label>
            <input
              type="password"
              name="password"
              placeholder="Enter Password"
              required
              value={user.password}
              onChange={handleInputChange}
            />

            <label htmlFor="phonenumber">
              <b>Phone Number</b>
            </label>
            <input
              type="tel"
              name="phonenumber"
              placeholder="Enter Phone Number"
              required
              value={user.phonenumber}
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
