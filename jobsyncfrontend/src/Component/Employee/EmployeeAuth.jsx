import React, { useState } from "react";
import { useFormik } from "formik";
import axios from "axios";
import "./EmployeeAuth.css";

const EmployeeAuth = ({ onLogin }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check token on mount


  // Formik for Login
  const loginFormik = useFormik({
    initialValues: {
      employeeemail: "",
      employeepassword: "",
    },
    onSubmit: async (values, { resetForm }) => {
      try {
        const res = await axios.post("http://localhost:8000/employee/login", values);
        alert(res.data.message);
        localStorage.setItem("token", res.data.token);
        onLogin && onLogin();
        resetForm();
      } catch (error) {
        alert(error.response?.data?.message || "Login failed");
      }
    },
  });

  // Formik for Register
  const registerFormik = useFormik({
    initialValues: {
      employeename: "",
      employeeemail: "",
      employeepassword: "",
    },
    onSubmit: async (values, { resetForm }) => {
      try {
        const res = await axios.post("http://localhost:8000/employee/register", values);
        alert(res.data.message);
        setIsRegister(false); // Switch to login after registration
        resetForm();
      } catch (error) {
        alert(error.response?.data?.message || "Registration failed");
      }
    },
  });

  return (
    <div className="employee-auth-container">
      <div className="auth-card">
        <div className="auth-left-panel">
          <div className="welcome-content">
            <h1>{isRegister ? "Create your account!" : "Welcome back!"}</h1>
            <p>
              {isRegister
                ? "Register to post jobs and manage your company profile."
                : "You can sign in to access with your existing account."}
            </p>
          </div>
        </div>

        <div className="auth-right-panel">
          <h2>{isRegister ? "Sign Up" : "Sign In"}</h2>

          {/* Conditional Form */}
          {isRegister ? (
            <form className="auth-form" onSubmit={registerFormik.handleSubmit}>
              <div className="input-group">
                <label className="input-label">Full Name</label>
                <span className="input-icon">👤</span>
                <input
                  type="text"
                  name="employeename"
                  placeholder="Enter your full name"
                  onChange={registerFormik.handleChange}
                  value={registerFormik.values.employeename}
                  required
                />
              </div>

              <div className="input-group">
                <label className="input-label">Email Address</label>
                <span className="input-icon">📧</span>
                <input
                  type="email"
                  name="employeeemail"
                  placeholder="Enter your email"
                  onChange={registerFormik.handleChange}
                  value={registerFormik.values.employeeemail}
                  required
                />
              </div>

              <div className="input-group">
                <label className="input-label">Password</label>
                <span className="input-icon">🔒</span>
                <input
                  type="password"
                  name="employeepassword"
                  placeholder="Enter your password"
                  onChange={registerFormik.handleChange}
                  value={registerFormik.values.employeepassword}
                  required
                />
              </div>

              <button type="submit" className="auth-submit-btn">
                Sign Up
              </button>
            </form>
          ) : (
            <form className="auth-form" onSubmit={loginFormik.handleSubmit}>
              <div className="input-group">
                <label className="input-label">Email Address</label>
                <span className="input-icon">📧</span>
                <input
                  type="email"
                  name="employeeemail"
                  placeholder="Enter your email"
                  onChange={loginFormik.handleChange}
                  value={loginFormik.values.employeeemail}
                  required
                />
              </div>

              <div className="input-group">
                <label className="input-label">Password</label>
                <span className="input-icon">🔒</span>
                <input
                  type="password"
                  name="employeepassword"
                  placeholder="Enter your password"
                  onChange={loginFormik.handleChange}
                  value={loginFormik.values.employeepassword}
                  required
                />
              </div>

              <button type="submit" className="auth-submit-btn">
                Sign In
              </button>
            </form>
          )}

          {/* Toggle button */}
          <div className="auth-switch-text">
            {isRegister ? (
              <span>
                Already have an account?{" "}
                <button
                  type="button"
                  className="switch-btn"
                  onClick={() => setIsRegister(false)}
                >
                  Sign In
                </button>
              </span>
            ) : (
              <span>
                New here?{" "}
                <button
                  type="button"
                  className="switch-btn"
                  onClick={() => setIsRegister(true)}
                >
                  Create an Account
                </button>
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeAuth;
