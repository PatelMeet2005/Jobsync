// ProfileDropdown.jsx
import React from "react";
import axios from "axios";
import "./ProfileDropDown.css";

const ProfileDropdown = ({ firstName, lastName, onClose }) => {
  const handleLogout = async () => {
    try {
      const response = await axios.post("http://localhost:8000/user/logout");
      console.log("Logout data : ", response.data);
      sessionStorage.clear();
      window.location.reload();
    } catch (error) {
      console.error("Logout error:", error);
      alert("Logout failed. Please try again.");
    }
  };

  return (
    <div className="dropdown-menu">
      <div className="dropdown-header">{firstName} {lastName}</div>
      <button
        className="dropdown-item"
        onClick={() => (window.location.href = "/profile")}
      >
        View Profile
      </button>
      <button className="dropdown-item logout" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
};

export default ProfileDropdown;
