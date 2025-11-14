// ProfileDropdown.jsx
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./ProfileDropDown.css";

const ProfileDropdown = ({ firstName, lastName, onClose }) => {
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onClose();
      }
    };

    // Add delay to avoid immediate close on avatar click
    const timer = setTimeout(() => {
      document.addEventListener("mousedown", handleClickOutside);
    }, 100);

    return () => {
      clearTimeout(timer);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  const handleLogout = async () => {
    try {
      const response = await axios.post("http://localhost:8000/user/logout");
      console.log("Logout data : ", response.data);
      sessionStorage.clear();
      localStorage.removeItem('token');
      window.location.href = "/";
    } catch (error) {
      console.error("Logout error:", error);
      sessionStorage.clear();
      localStorage.removeItem('token');
      window.location.href = "/";
    }
  };

  const handleLogoutClick = () => {
    console.log("Logout button clicked, showing modal");
    setShowLogoutConfirm(true);
  };

  const confirmLogout = (e) => {
    console.log("Confirm logout clicked");
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setShowLogoutConfirm(false);
    handleLogout();
  };

  const cancelLogout = (e) => {
    console.log("Cancel logout clicked");
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setShowLogoutConfirm(false);
  };

  const handleProfileClick = () => {
    onClose();
    navigate("/profile");
  };

  const userEmail = sessionStorage.getItem("userEmail");
  const role = sessionStorage.getItem("role");

  return (
    <>
      <div className="profile-dropdown-menu" ref={dropdownRef}>
        <div className="profile-dropdown-header">
          <div className="profile-dropdown-avatar">
            {firstName?.charAt(0)}
          </div>
          <div className="profile-dropdown-user-info">
            <div className="profile-dropdown-name">{firstName} {lastName}</div>
            <div className="profile-dropdown-email">{userEmail}</div>
            {role && <div className="profile-dropdown-role">{role}</div>}
          </div>
        </div>
        <div className="profile-dropdown-divider"></div>
        <button
          className="profile-dropdown-item"
          onClick={handleProfileClick}
        >
          <i className="fas fa-user"></i>
          <span>View Profile</span>
        </button>
        <button
          className="profile-dropdown-item"
          onClick={() => {
            onClose();
            navigate("/");
          }}
        >
          <i className="fas fa-briefcase"></i>
          <span>My Jobs</span>
        </button>
        <div className="profile-dropdown-divider"></div>
        <button className="profile-dropdown-item profile-dropdown-logout" onClick={handleLogoutClick}>
          <i className="fas fa-sign-out-alt"></i>
          <span>Logout</span>
        </button>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div 
          className="logout-modal-overlay"
        >
          <div className="logout-modal">
            <div className="logout-modal-icon">
              <i className="fas fa-sign-out-alt"></i>
            </div>
            <h3>Confirm Logout</h3>
            <p>Are you sure you want to logout?</p>
            <div className="logout-modal-actions">
              <button 
                type="button"
                className="logout-cancel-btn" 
                onMouseDown={(e) => {
                  console.log("Cancel button mousedown");
                  e.preventDefault();
                  e.stopPropagation();
                  cancelLogout(e);
                }}
              >
                Cancel
              </button>
              <button 
                type="button"
                className="logout-confirm-btn" 
                onMouseDown={(e) => {
                  console.log("Confirm button mousedown");
                  e.preventDefault();
                  e.stopPropagation();
                  confirmLogout(e);
                }}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProfileDropdown;
