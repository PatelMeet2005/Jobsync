// ProfileDropdown.jsx
import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./ProfileDropDown.css";

const ProfileDropdown = ({ firstName, lastName, onClose }) => {
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

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
      window.location.href = "/";
    } catch (error) {
      console.error("Logout error:", error);
      sessionStorage.clear();
      window.location.href = "/";
    }
  };

  const handleProfileClick = () => {
    onClose();
    navigate("/profile");
  };

  const userEmail = sessionStorage.getItem("userEmail");
  const role = sessionStorage.getItem("role");

  return (
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
      <button className="profile-dropdown-item profile-dropdown-logout" onClick={handleLogout}>
        <i className="fas fa-sign-out-alt"></i>
        <span>Logout</span>
      </button>
    </div>
  );
};

export default ProfileDropdown;
