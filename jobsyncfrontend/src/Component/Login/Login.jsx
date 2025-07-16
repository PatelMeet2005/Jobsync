import React, { useState } from "react";
import "./Login.css";

const Login = ({ onClose, switchToSignup }) => {
  const [loginUser, setLoginUser] = useState({
    email:"",
    password:"",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setLoginUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log(loginUser);
    
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
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={loginUser.email}
                  onChange={handleInputChange}
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
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={loginUser.password}
                  onChange={handleInputChange}
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
