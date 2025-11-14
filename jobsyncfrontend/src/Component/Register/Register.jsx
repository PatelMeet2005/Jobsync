import React, { useState } from "react";
import "./Register.css";
import axios from 'axios';
import { toast } from 'react-toastify';

const Signup = ({ onClose, switchToLogin }) => {

  // State variables for form inputs
  const [userFirstName, setUserFirstName] = useState('');
  const [userLastName, setUserLastName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [userPhoneNumber, setUserPhoneNumber] = useState('');

  const fnamechange = (e) => {
    setUserFirstName(e.target.value);
  }

  const lnamechange = (e) => {
    setUserLastName(e.target.value);
  }

  const handlemail = (e) => {
    setUserEmail(e.target.value);
  }

  const handlepassword = (e) => {
    setUserPassword(e.target.value);
  }

  const handlephone = (e) => {
    setUserPhoneNumber(e.target.value);
  }

  const handleFormsubmit = async (e) => {
    e.preventDefault();


    // Prepare data to be sent in the request
    const data = {
      userFirstName : userFirstName,
      userLastName : userLastName,
      userEmail : userEmail,
      userPassword : userPassword,
      userPhoneNumber : userPhoneNumber,
    }

    try {
      const response = await axios.post(`http://localhost:8000/user/register`, data);
      console.log("Response Data:", response.data);
      toast.success(response.data.message || 'Registration successful!');

      // reset form fields after successful registration
      setUserFirstName('');
      setUserLastName('');
      setUserEmail('');
      setUserPassword('');
      setUserPhoneNumber('');
      
      // redirect to login page or close the modal
      onClose();
      switchToLogin();
      

    } catch (error) {
      console.log("Error", error);
      toast.error(error.response?.data?.message || 'Registration failed. Please try again.');

    }
  }

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
                  value={userFirstName}
                  onChange={fnamechange}
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
                  value={userLastName}
                  onChange={lnamechange}
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
              value={userEmail}
              onChange={handlemail}
            />

            <label htmlFor="userPassword">
              <b>Password</b>
            </label>
            <input
              type="password"
              name="userPassword"
              placeholder="Enter Password"
              required
              value={userPassword}
              onChange={handlepassword}
            />

            <label htmlFor="userPhoneNumber">
              <b>Phone Number</b>
            </label>
            <input
              type="tel"
              name="userPhoneNumber"
              placeholder="Enter Phone Number"
              required
              value={userPhoneNumber}
              onChange={handlephone}
            />

            <button type="submit">Register</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
