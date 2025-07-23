import React, { useState } from "react";
import "./Login.css";
import axios from "axios";

const Login = ({ onClose, switchToSignup }) => {

  const [userEmail, setUserEmail] = useState('');
  const [userPassword, setUserPassword] = useState('');


  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prepare data to be sent in the request
    const loginUser = {
      userEmail: userEmail,
      userPassword: userPassword,
    };

    // Here you would typically send the login data to your backend for authentication
    try{
      const response = await axios.post(`http://localhost:8000/user/login`, loginUser);
      console.log("Response Data:", response.data);
      alert(response.data.message);

      // Reset the form after submission
      setUserEmail('');
      setUserPassword('');

      // Close the modal or redirect to another page
      onClose();
    }
    catch(error){
      console.error("Error during login:", error.message);
      alert(error.response.data.message);
      
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-btn" onClick={onClose}>
          ×
        </button>
        <div className="heading">
          <h2>Sign In</h2>
          <p className="heading-p">Sign in to your Account.</p>
          <div className="signup">
            <p>Don't have an account?</p>
            <a href="#" className="google-btn" onClick={switchToSignup}>
              Sign up
            </a>
          </div>
          <form className="login-form" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="login-email" className="login-email-label">
                <b>Email address</b>
              </label>
              <div className="login-email">
                <input
                  id="login-email"
                  name="userEmail"
                  type="email"
                  autoComplete="email"
                  required
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  className="login-email-input"
                />
              </div>
            </div>

            <div>
              <label htmlFor="login-password" className="login-password-label">
                <b>Password</b>
              </label>
              <div className="login-password">
                <input
                  id="login-password"
                  name="userPassword"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={userPassword}
                  onChange={(e) => setUserPassword(e.target.value)}
                  className="login-password-input"
                />
              </div>
            </div>

            <div>
              <button type="submit" className="login-btn">
                Sign in
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
