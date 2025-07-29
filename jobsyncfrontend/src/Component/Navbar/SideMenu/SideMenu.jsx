import React, { useState } from "react";
import categories from "../../../Data/categories.json";
import "./SideMenu.css";

const SideMenu = ({ 
  isOpen, 
  onClose, 
  selectedEmail, 
  selectedFirstName, 
  selectedLastName,
  openLogin,
  openRegister 
}) => {
  const [openJobs, setOpenJobs] = useState(false);

  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:8000/user/logout", {
        method: "POST"
      });
      console.log("Logout data : ", response);
      sessionStorage.clear();
      window.location.reload();
    } catch (error) {
      console.error("Logout error:", error);
      alert("Logout failed. Please try again.");
    }
  };

  const firstLetter = selectedFirstName?.charAt(0).toUpperCase() || "";

  return (
    <div className={`side-menu ${isOpen ? "open" : ""}`}>
      <button className="close-btn" onClick={onClose}>&times;</button>
      
      <nav className="side-nav">
        <ul>
          <li>
            <button
              className="expandable"
              onClick={() => setOpenJobs(!openJobs)}
            >
              Jobs {openJobs ? "▲" : "▼"}
            </button>
            {openJobs && (
              <div className="jobs-submenu">
                <div className="job-category">
                  <h4>Popular Categories</h4>
                  <ul>
                    {categories.POPULAR_CATEGORIES.map((item, i) => (
                      <li key={i}><a href={`/jobs/category/${item}`}>{item}</a></li>
                    ))}
                  </ul>
                </div>
                <div className="job-category">
                  <h4>Jobs in Demand</h4>
                  <ul>
                    {categories.JOBS_IN_DEMAND.map((item, i) => (
                      <li key={i}><a href={`/jobs/demand/${item}`}>{item}</a></li>
                    ))}
                  </ul>
                </div>
                <div className="job-category">
                  <h4>Jobs by Location</h4>
                  <ul>
                    {categories.JOBS_BY_LOCATION.map((item, i) => (
                      <li key={i}><a href={`/jobs/location/${item}`}>{item}</a></li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </li>
          <li><a href="/companie">Companies</a></li>
          <li><a href="/about">About</a></li>
        </ul>
      </nav>

      <div className="side-footer">
        {selectedEmail ? (
          <div className="side-user-section">
            <div className="side-user-info">
              <div className="side-avatar">{firstLetter}</div>
              <div className="side-user-details">
                <span>{selectedFirstName} {selectedLastName}</span>
              </div>
            </div>
            <div className="side-user-actions">
              <button 
                className="side-profile-btn"
                onClick={() => window.location.href = "/profile"}
              >
                View Profile
              </button>
              <button 
                className="side-logout-btn"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          </div>
        ) : (
          <div className="side-auth-buttons">
            <button 
              className="side-login-btn"
              onClick={() => {
                openLogin();
                onClose();
              }}
            >
              Sign in / sign up
            </button>
            <button className="side-emp-btn">
              Employees
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SideMenu;
