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
          <form className="" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="login-email" className="">
                Email address
              </label>
              <div className="">
                <input
                  id="login-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={loginUser.email}
                  onChange={handleInputChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="login-password" className="">
                Password
              </label>
              <div className="">
                <input
                  id="login-password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={loginUser.password}
                  onChange={handleInputChange}
                  className=""
                />
              </div>
            </div>

            <div>
              <button type="submit" className="">
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
