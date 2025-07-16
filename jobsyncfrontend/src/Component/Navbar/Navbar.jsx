import React, { useState } from 'react'
import './Navbar.css'

import Login from '../Login/Login';
import Register from '../Register/Register';

const Navbar = () => {

  const [showLogin,setShowLogin] = useState(false);
  const [showRegister,setShowRegister] = useState(false);

  const openLoginModel = () => {
    setShowLogin(true);
    setShowRegister(false);
  };

  const openRegisterModel = () => {
    setShowRegister(true);
    setShowLogin(false);
  };

  const closeModel = () => {
    setShowLogin(false);
    setShowRegister(false);
  };

  return (
    <>
      <div className="mainNav">
        <div className="logo">JobSync</div>

        <div className="navLink">
          <ul>
            <li><a href="/">Jobs</a></li>
            <li><a href="#">Companies</a></li>
            <li><a href="#">About</a></li>
          </ul>
        </div>

        <div className="searchbar">
          <input type="text" />
          <button>serch</button>
        </div>

        <div className="login">
          <button id='clt' onClick={openLoginModel}>Sign in / sign up</button>
          <button id='emp'>Employees</button>
        </div>

        {showLogin && <Login onClose = {closeModel} switchToSignup={openRegisterModel} />}
        {showRegister && <Register onClose = {closeModel} switchToLogin={openLoginModel} />}

      </div>
    </>
  )
}

export default Navbar