import React, { useState } from 'react'
import './Navbar.css'

import Login from '../Login/Login';

const Navbar = () => {

  const [showLogin,setShowLogin] = useState(false);

  const openModel = () => setShowLogin(true);

  const closeModel = () => setShowLogin(false);

  return (
    <>
      <div className="mainNav">
        <div className="logo">JobSync</div>

        <div className="navLink">
          <ul>
            <li><a href="#">Jobs</a></li>
            <li><a href="#">Companies</a></li>
            <li><a href="#">About</a></li>
          </ul>
        </div>

        <div className="serchbar">
          <input type="text" />
          <button>serch</button>
        </div>

        <div className="login">
          <button id='clt' onClick={openModel}>Sign in / sign up</button>
          <button id='emp'>Employees</button>
        </div>

        {showLogin && <Login onClose = {closeModel} />}

      </div>
    </>
  )
}

export default Navbar