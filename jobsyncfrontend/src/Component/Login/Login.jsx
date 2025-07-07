import React from 'react'
import './Login.css'

const Login = ( { onClose }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-btn" onClick={onClose}>×</button>
        <h2>Sign In</h2>
        <p>Sign in to your account</p>
        <label>Email address</label>
        <input type="email" placeholder="admin@gmail.com" />
        <label>Password</label>
        <input type="password" placeholder="••••" />
        <button className="login-btn">Sign In</button>
      </div>
    </div>
  )
}

export default Login