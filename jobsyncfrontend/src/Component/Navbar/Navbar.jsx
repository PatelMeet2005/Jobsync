import React from 'react'
import './Navbar.css'

const Navbar = () => {
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
          <button id='clt'>Sign in / sign up</button>
          <button id='emp'>Employees</button>
        </div>


      </div>
    </>
  )
}

export default Navbar