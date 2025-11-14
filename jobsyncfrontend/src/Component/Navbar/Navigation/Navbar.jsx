// Navbar.jsx
import React, { useState, useRef } from "react";
import "./Navbar.css";
import ProfileDropdown from "../ProfileDropDown/ProfileDropdown";
import Login from "../../Login/Login";
import Register from "../../Register/Register";
import { IoSearch } from "react-icons/io5";
import SideMenu from "../SideMenu/SideMenu";

const Navbar = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [sideOpen, setSideOpen] = useState(false);

  const selectedEmail = sessionStorage.getItem("userEmail");
  const selectedFirstName = sessionStorage.getItem("userFirstName");
  const selectedLastName = sessionStorage.getItem("userLastName");

  const openLogin = () => {
    setShowLogin(true);
    setShowRegister(false);
  };

  const openRegister = () => {
    setShowRegister(true);
    setShowLogin(false);
  };

  const closeModals = () => {
    setShowLogin(false);
    setShowRegister(false);
  };

  const firstLetter = selectedFirstName?.charAt(0).toUpperCase() || "";

  return (
    <>
      <header className="navbar">
        <div className="logo"><span className="highlight">Job</span>Sync</div>

        {/* Hamburger - only visible below 800px */}
        <div className="hamburger" onClick={() => setSideOpen(true)}>
          <span></span>
          <span></span>
          <span></span>
        </div>

        {/* Desktop Navigation - hidden below 800px */}
        <nav className="nav-links">
          <ul>
            {/* <JobDropdown /> */}
            <li><a href="/">Jobs</a></li>
            <li><a href="/companie">Companies</a></li>
            <li><a href="/about">About</a></li>
          </ul>
        </nav>

        <div className="search-login-wrap">
          {/* <div className="searchbar">
            <input type="text" placeholder="Search jobs..." />
            <button><IoSearch /></button>
          </div> */}

          {/* Desktop Auth - hidden below 800px */}
          <div className="desktop-auth">
            {selectedEmail ? (
              <div className="user-section">
                <button className="avatar-btn" onClick={() => setProfileOpen(!profileOpen)}>{firstLetter}</button>
                {profileOpen && (
                  <ProfileDropdown
                    firstName={selectedFirstName}
                    lastName={selectedLastName}
                    onClose={() => setProfileOpen(false)}
                  />
                )}
              </div>
            ) : (
              <div className="login-btns">
                <button onClick={openLogin}>Sign in / sign up</button>
                <button className="emp"><a href="/employees">Employees</a></button>
              </div>
            )}
          </div>
        </div>

        {/* Side Menu - only for mobile below 800px */}
        <SideMenu 
          isOpen={sideOpen} 
          onClose={() => setSideOpen(false)}
          selectedEmail={selectedEmail}
          selectedFirstName={selectedFirstName}
          selectedLastName={selectedLastName}
          openLogin={openLogin}
          openRegister={openRegister}
        />

        {showLogin && <Login onClose={closeModals} switchToSignup={openRegister} />}
        {showRegister && <Register onClose={closeModals} switchToLogin={openLogin} />}
      </header>
    </>
  );
};

export default Navbar;
