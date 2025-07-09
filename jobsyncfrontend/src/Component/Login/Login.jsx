import React from 'react'
import './Login.css'

const Login = ( { onClose }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-btn" onClick={onClose}>×</button>
        <div className="heading">
          <h2>Sign In</h2>
          
        </div>
      </div>
    </div>
  )
}

export default Login