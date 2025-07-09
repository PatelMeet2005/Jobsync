import React from 'react'
import './Login.css'

const Login = ( { onClose }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-btn" onClick={onClose}>×</button>
        <div className="heading">
          <h2>Sign In</h2>
          <p className='heading-p'>Sign in to your Account.</p>
          <div className="signup">
            <p>Don't have an account?</p>
            <a href="#" className="google-btn">Sign up</a>           
          </div>
          <form action="">
            <label htmlFor=""></label>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login